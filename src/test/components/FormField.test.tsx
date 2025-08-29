import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { render } from "../helpers/test-utils";
import { FormField } from "../../components/FormField";
import type { Question } from "../../types/form";

const FormFieldTestWrapper = ({ question }: { question: Question }) => {
  const {
    control,
    formState: { errors },
  } = useForm();
  return <FormField question={question} control={control} errors={errors} />;
};

describe("FormField", () => {
  it("renders a text input with label and placeholder", () => {
    const q: Question = {
      id: "username",
      label: "Username",
      type: "text",
      required: true,
      placeholder: "Enter your username",
    };

    render(<FormFieldTestWrapper question={q} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your username/i)
    ).toBeInTheDocument();
  });

  it("renders a group of radio buttons with shared name", () => {
    const q: Question = {
      id: "color",
      label: "Favorite Color",
      type: "radio_buttons",
      required: true,
      options: ["Red", "Green", "Blue"],
    };

    render(<FormFieldTestWrapper question={q} />);

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    radios.forEach((r) => expect(r).toHaveAttribute("name", "color"));
  });

  it("renders a dropdown with placeholder and options", () => {
    const q: Question = {
      id: "country",
      label: "Country",
      type: "drop_down",
      required: false,
      placeholder: "Select your country",
      options: ["USA", "Canada"],
    };

    render(<FormFieldTestWrapper question={q} />);

    const select = screen.getByLabelText(/country/i);
    expect(select.tagName).toBe("SELECT");
    expect(screen.getByText(/select your country/i)).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /usa/i })).toBeInTheDocument();
  });

  it("shows an error message if provided in form state", () => {
    const q: Question = {
      id: "email",
      label: "Email",
      type: "text",
      required: true,
    };

    const WithError = () => {
      const { control } = useForm();
      return (
        <FormField
          question={q}
          control={control}
          errors={{ email: { type: "required", message: "Email is required" } }}
        />
      );
    };

    render(<WithError />);
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it("gracefully handles unsupported field types", () => {
    const q = {
      id: "weird",
      label: "Weird Field",
      type: "alien_widget",
      required: false,
    } as unknown as Question;

    render(<FormFieldTestWrapper question={q} />);
    expect(screen.getByText(/unsupported field type/i)).toBeInTheDocument();
  });
});
